package com.capstonebau2025.centralhub.helper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class MqttUserControl {
    private final Logger logger = LoggerFactory.getLogger(MqttUserControl.class);

    @Value("${mosquitto.adminUsername}")
    private String ADMIN_USER;

    @Value("${mosquitto.adminPassword}")
    private String ADMIN_PASSWORD;

    public boolean createMqttUser(String username, String password) {

        if (!deleteUserIfExists(username)) {
            return false;
        }

        int exitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "createClient",
                username, "-p", password
        );

        if (exitCode != 0)
            logger.error("mqtt failed to create user: {}", username);
        return exitCode == 0;
    }
    public boolean createDefaultUser(String username, String password) {
        if(
                createMqttUser(username, password) &&
                createRole(username + "-role") &&
                grantWriteAccess(username + "-role", "discovery/+") &&
                grantPatternReadAccess(username + "-role", "config/+") &&
                denyReadAccess(username + "-role", "config/+") &&
                addRoleToUser(username + "-role", username)
        ) {
            logger.info("mqtt created default user: {}", username);
            return true;
        }
        return false;
    }
    public boolean createDeviceUser(String username, String password, long deviceUid) {

        // in and out from device prospective
        String inTopic = "device/" + deviceUid + "/in";
        String outTopic = "device/" + deviceUid + "/out";
        String outFeedbackTopics = "device/" + deviceUid + "/out/+";
        String roleName = "role-" + deviceUid;

        if(createMqttUser(username, password) &&
            createRole(roleName) &&
            grantWriteAccess(roleName, outTopic) &&
            grantWriteAccess(roleName, outFeedbackTopics) &&
            grantReadAccess(roleName, inTopic) &&
            addRoleToUser(roleName, username)
        ) {
            logger.info("mqtt created device user: {}", username);
            return true;
        }
        logger.error("mqtt failed to assign topics permissions for device: {}", username);
        return false;
    }
    public boolean createFullAccessUser(String username, String password) {

        if (createMqttUser(username, password) &&
            createRole("full-access-role") &&
            grantWriteAccess("full-access-role", "#") &&
            grantReadAccess("full-access-role", "#") &&
            grantPatternReadAccess("full-access-role", "#") &&
            addRoleToUser("full-access-role", username)
        ) {
            logger.info("mqtt created admin user: {}", username);
            return true;
        }
        logger.error("mqtt failed to grant full mqtt topic access to user: {}", username);
        return false;
    }
    public boolean createRole(String roleName) {

        int exitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "createRole",
                roleName
        );

        return exitCode == 0;
    }
    public boolean addRoleToUser(String roleName, String username) {

        int exitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addClientRole",
                username, roleName,
                "10"
        );

        return exitCode == 0;
    }
    public boolean grantWriteAccess(String roleName, String topic) {

        int exitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "publishClientSend", topic,
                "allow", "10"
        );

        return exitCode == 0;
    }
    public boolean grantReadAccess(String roleName, String topic) {

        int subExitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "subscribeLiteral", topic,
                "allow", "10"
        );

        int receiveExitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "publishClientReceive", topic,
                "allow", "10"
        );

        return (receiveExitCode == 0 && subExitCode == 0);
    }
    public boolean grantPatternReadAccess(String roleName, String topic) {

        int subExitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "subscribePattern", topic,
                "allow", "10"
        );

        int receiveExitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "publishClientReceive", topic,
                "allow", "10"
        );

        return (receiveExitCode == 0 && subExitCode == 0);
    }
    public boolean denyReadAccess(String roleName, String topic) {

        int exitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "addRoleACL", roleName,
                "subscribeLiteral", topic,
                "deny", "10"
        );

        return exitCode == 0;
    }
    public boolean deleteUserIfExists(String username) {
        // Check if user exists
        int checkExitCode = runCommand(
                "mosquitto_ctrl",
                "-h", "localhost",
                "-u", ADMIN_USER,
                "-P", ADMIN_PASSWORD,
                "dynsec", "getClient",
                username
        );

        // If user exists, delete it and its role
        if (checkExitCode == 0) {
            String roleName = "role-" + username;

            // Delete the user
            int deleteUserExitCode = runCommand(
                    "mosquitto_ctrl",
                    "-h", "localhost",
                    "-u", ADMIN_USER,
                    "-P", ADMIN_PASSWORD,
                    "dynsec", "deleteClient",
                    username
            );

            if (deleteUserExitCode != 0) {
                logger.error("mqtt failed to delete existing user: {}", username);
                return false;
            }

            // Delete the role
            runCommand(
                    "mosquitto_ctrl",
                    "-h", "localhost",
                    "-u", ADMIN_USER,
                    "-P", ADMIN_PASSWORD,
                    "dynsec", "deleteRole",
                    roleName
            );
            logger.warn("mqtt deleted device user: {}", username);
        }

        return true;
    }
    private int runCommand(String... command) {

        try {
            return new ProcessBuilder(command).start().waitFor();
        } catch (InterruptedException | IOException e) {
            logger.error("mqtt failed to run process command", e);
            return -1;
        }
    }
}