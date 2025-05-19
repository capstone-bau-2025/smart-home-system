import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import DismissKeyboard from "../utils/DismissKeyboard";
import {
  setRuleName,
  setRuleDescription,
  setCooldownDuration,
} from "../../store/slices/automationSlice";

export default function AutomationDetails({
  currentAutomation,
  edit,
  setModalVisible,
  navigation,
}) {
  const iconName = {
    SCHEDULE: "alarm-sharp",
    EVENT: "eye-sharp",
    STATE_UPDATE: "bulb-sharp",
  };

  const paleIconBg = {
    SCHEDULE: "#eaffea",
    EVENT: "#e3f0ff",
    STATE_UPDATE: "#efe3ff",
  };

  const iconColorMap = {
    SCHEDULE: "#3e914f",
    EVENT: "#2f5fa3",
    STATE_UPDATE: "#6a11cb",
    action: "#244ced",
    cooldown: "#a37000",
  };

  const dispatch = useDispatch();

  const name = useSelector((state) => state.automation.ruleName);
  const description = useSelector((state) => state.automation.ruleDescription);
  const cooldownDuration = useSelector(
    (state) => state.automation.cooldownDuration
  );
  const savedType = useSelector((state) => state.automation.triggerType);
  const storedSelectedTime = useSelector(
    (state) => state.automation.scheduledTime
  );

  const resolvedType = savedType || currentAutomation?.triggerType;

  const getTypeLabel = () => {
    switch (resolvedType) {
      case "SCHEDULE":
        return `Schedule – ${storedSelectedTime || "Not set"}`;
      case "EVENT":
        return `Event`;
      case "STATE_UPDATE":
        return "Device Status Change";
      default:
        return "Select type";
    }
  };

  return (
    <DismissKeyboard>
      <View>
        {edit && (
          <>
            <Text style={styles.infoText}>Name</Text>
            <View style={styles.propContainer}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => dispatch(setRuleName(text))}
                placeholder="Enter Automation Name"
                placeholderTextColor="#999"
                multiline
              />
            </View>
          </>
        )}
        <Text style={styles.infoText}>Description</Text>
        <View style={edit ? styles.propContainer : styles.propContainerRow}>
          {!edit && (
            <View style={[styles.iconWrapper, { backgroundColor: "#fde2e2" }]}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#d9534f"
              />
            </View>
          )}

          {edit ? (
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={(text) => dispatch(setRuleDescription(text))}
              placeholder="Enter description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
              maxLength={200}
            />
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.ruleDescription || "No details available."}
            </Text>
          )}
        </View>
        <Text style={styles.infoText}>Trigger Type (If)</Text>
        <View style={styles.propContainerRow}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: paleIconBg[resolvedType] || "#ddd" },
            ]}
          >
            <Ionicons
              name={iconName[resolvedType] || "help-circle-outline"}
              size={24}
              color={iconColorMap[resolvedType] || "#333"}
            />
          </View>
          {edit ? (
            <TouchableOpacity
              style={styles.touchableField}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.propText}>{getTypeLabel()}</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#666"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.triggerType || "No details available."}
            </Text>
          )}
        </View>

        <Text style={styles.infoText}>Action (Then)</Text>
        <View style={styles.propContainerRow}>
          <View style={[styles.iconWrapper, { backgroundColor: "#e7edff" }]}>
            <Ionicons name="flash" size={24} color={iconColorMap.action} />
          </View>
          {edit ? (
            <TouchableOpacity
              style={styles.touchableField}
              onPress={() => navigation.navigate("Action")}
            >
              <Text style={styles.propText}>Select action</Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#666"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          ) : (
            <View style={{ flex: 1 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ flexDirection: "row", gap: 15 }}
              >
                {currentAutomation.actions?.length > 0 ? (
                  currentAutomation.actions.map((action, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderRadius: 8,
                        padding: 10,
                        marginRight: 5,
                        minWidth: 140,
                      }}
                    >
                      <Text style={styles.propText}>
                        {`${action.type} → ${
                          action.actionValue || action.commandId
                        }`}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.propText}>No details available.</Text>
                )}
              </ScrollView>
            </View>
          )}
        </View>

        <Text style={styles.infoText}>Cool Down Duration (minutes)</Text>
        <View style={styles.propContainerRow}>
          <View style={[styles.iconWrapper, { backgroundColor: "#fff3cd" }]}>
            <Ionicons
              name="hourglass"
              size={24}
              color={iconColorMap.cooldown}
            />
          </View>
          {edit ? (
            <TextInput
              style={styles.propText}
              keyboardType="numeric"
              placeholder="Enter duration"
              value={cooldownDuration}
              onChangeText={(text) => dispatch(setCooldownDuration(text))}
              placeholderTextColor="#999"
              maxLength={2}
            />
          ) : (
            <Text style={styles.propText}>
              {currentAutomation.cooldownDuration
                ? `${currentAutomation.cooldownDuration} minutes`
                : "No details available."}
            </Text>
          )}
        </View>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  propContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    width: "100%",
  },
  propContainerRow: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    alignSelf: "stretch",
  },
  propText: {
    fontFamily: "Lexend-Regular",
    fontSize: 18,
    textAlign: "left",
    flex: 1,
    flexShrink: 1,
    color: "#333",
  },
  input: {
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  infoText: {
    fontFamily: "Lexend-Regular",
    fontSize: 15,
    textAlign: "left",
    marginBottom: 3,
    left: 5,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableField: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  editIcon: {
    marginLeft: 10,
  },
});
