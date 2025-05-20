import { createSlice } from "@reduxjs/toolkit";

const automationSlice = createSlice({
  name: "automation",
  initialState: {
    ruleName: null,
    ruleDescription: null,
    triggerType: null,
    scheduledTime: null,
    cooldownDuration: null,
    eventId: null,
    deviceId: null,
    stateValueId: null,
    stateTriggerValue: null,
    actions: [], // array of { type, deviceId, stateValueId, commandId, actionValue }
  },
  reducers: {
    setRuleName: (state, action) => {
      state.ruleName = action.payload;
    },
    setRuleDescription: (state, action) => {
      state.ruleDescription = action.payload;
    },
    setTriggerType: (state, action) => {
      state.triggerType = action.payload;
    },
    setScheduledTime: (state, action) => {
      state.scheduledTime = action.payload;
    },
    setCooldownDuration: (state, action) => {
      state.cooldownDuration = action.payload;
    },
    setEventId: (state, action) => {
      state.eventId = action.payload;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    setStateValueId: (state, action) => {
      state.stateValueId = action.payload;
    },
    setStateTriggerValue: (state, action) => {
      state.stateTriggerValue = action.payload;
    },
    setActions: (state, action) => {
      state.actions = action.payload;
    },
    resetAutomation: (state) => {
      state.ruleName = null;
      state.ruleDescription = null;
      state.triggerType = null;
      state.scheduledTime = null;
      state.cooldownDuration = null;
      state.eventId = null;
      state.deviceId = null;
      state.stateValueId = null;
      state.stateTriggerValue = null;
      state.actions = [];
    },
  },
});

export const {
  setRuleName,
  setRuleDescription,
  setTriggerType,
  setScheduledTime,
  setCooldownDuration,
  setEventId,
  setDeviceId,
  setStateValueId,
  setStateTriggerValue,
  setActions,
  resetAutomation,
} = automationSlice.actions;

export default automationSlice.reducer;
