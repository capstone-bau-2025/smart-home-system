package com.capstonebau2025.centralhub.helper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class MqttDynControl {
    //TODO: encapsulate command

    private static final Logger logger = LoggerFactory.getLogger(MqttDynControl.class);

    private static String ADMIN_USER;
    private static String ADMIN_PASSWORD;

    @Autowired
    public MqttDynControl(Environment env) {
        ADMIN_USER = env.getProperty("mosquitto.adminUsername");
        ADMIN_PASSWORD = env.getProperty("mosquitto.adminPassword");
    }

    public static boolean createMqttUser(String username, String password) throws IOException, InterruptedException {
        int exitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "createClient",
                username, "-p", password
        ).start().waitFor();

        if (exitCode != 0)
            logger.error("Failed to create user: {}", username);
        return exitCode == 0;
    }

    public static boolean setupDeviceAccessControl(String username, long deviceUid) throws IOException, InterruptedException {

        // in and out from device prospective
        String inTopic = "device/" + deviceUid + "/in";
        String outTopic = "device/" + deviceUid + "/out";
        String outFeedbackTopics = "device/" + deviceUid + "/out/+";
        String roleName = "role-" + deviceUid;

        if(
            createRole(roleName) &&
            grantWriteAccess(roleName, outTopic) &&
            grantWriteAccess(roleName, outFeedbackTopics) &&
            grantReadAccess(roleName, inTopic) &&
            addRoleToUser(roleName, username)
        ) {
            logger.info("mqtt user created and topics permissions assigned for device: {}", username);
            return true;
        }
        logger.error("Failed to assign topics permissions for device: {}", username);
        return false;
    }

    public static boolean grantFullAccess(String username) throws IOException, InterruptedException {

        if (
            createRole("full-access-role") &&
            grantWriteAccess("full-access-role", "#") &&
            grantReadAccess("full-access-role", "#") &&
            grantPatternReadAccess("full-access-role", "#") &&
            addRoleToUser("full-access-role", username)
        ) {
            logger.info("Full mqtt topic access granted to user: {}", username);
            return true;
        }
        logger.error("Failed to grant full mqtt topic access to user: {}", username);
        return false;
    }

    public static boolean createRole(String roleName) throws IOException, InterruptedException {

        int exitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "createRole",
                roleName
        ).start().waitFor();

        return exitCode == 0;
    }
    public static boolean addRoleToUser(String roleName, String username) throws IOException, InterruptedException {

        int exitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addClientRole",
                username, roleName,
                "10"
        ).start().waitFor();

        return exitCode == 0;
    }
    public static boolean grantWriteAccess(String roleName, String topic) throws IOException, InterruptedException {

        int exitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "publishClientSend", topic,
                "allow", "10"
        ).start().waitFor();

        return exitCode == 0;
    }
    public static boolean grantReadAccess(String roleName, String topic) throws IOException, InterruptedException {

        int subExitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "subscribeLiteral", topic,
                "allow", "10"
        ).start().waitFor();

        int receiveExitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "publishClientReceive", topic,
                "allow", "10"
        ).start().waitFor();

        return (receiveExitCode == 0 && subExitCode == 0);
    }
    public static boolean grantPatternReadAccess(String roleName, String topic) throws IOException, InterruptedException {

        int subExitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "subscribePattern", topic,
                "allow", "10"
        ).start().waitFor();

        int receiveExitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "publishClientReceive", topic,
                "allow", "10"
        ).start().waitFor();

        return (receiveExitCode == 0 && subExitCode == 0);
    }
    public static boolean denyReadAccess(String roleName, String topic) throws IOException, InterruptedException {

        int exitCode = new ProcessBuilder(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "subscribeLiteral", topic,
                "deny", "10"
        ).start().waitFor();

        return exitCode == 0;
    }
}