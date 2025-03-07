package com.capstonebau2025.centralhub.dto;

import com.capstonebau2025.centralhub.entity.DeviceModel;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class DeviceDetails {

    @NotNull
    @JsonProperty(value = "uid", required = true)
    private long uid;

    @NotNull
    @JsonProperty(value = "model", required = true)
    private String model;

    private String description;

    @NotNull
    @JsonProperty(value = "type", required = true)
    private DeviceModel.DeviceModelType type;

    @NotNull
    @JsonProperty(value = "support_streaming", required = true)
    private boolean supportStreaming;

    private List<State> states;
    private List<Command> commands;
    private List<Event> events;

    @Data
    public static class State {
        @NotNull
        @JsonProperty(value = "number", required = true)
        private int number;

        @NotNull
        @JsonProperty(value = "is_mutable", required = true)
        private boolean isMutable;

        @NotNull
        @JsonProperty(value = "name", required = true)
        private String name;

        @NotNull
        @JsonProperty(value = "type", required = true)
        private com.capstonebau2025.centralhub.entity.State.StateType type;

        @JsonProperty("min_range")
        private Integer minRange;

        @JsonProperty("max_range")
        private Integer maxRange;

        private List<String> choices;
    }

    @Data
    public static class Command {

        @NotNull
        @JsonProperty(value = "number", required = true)
        private int number;

        @NotNull
        @JsonProperty(value = "name", required = true)
        private String name;

        private String description;
    }

    @Data
    public static class Event {

        @NotNull
        @JsonProperty(value = "number", required = true)
        private int number;

        @NotNull
        @JsonProperty(value = "name", required = true)
        private String name;
        private String description;
    }
}
