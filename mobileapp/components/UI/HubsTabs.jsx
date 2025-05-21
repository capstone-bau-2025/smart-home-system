import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

//renders the hubs as a horizontal list of tabs
export default function HubsTabs({
  hubs,
  setSelectedTab,
  selectedTab,
  color = "orange",
}) {
  return (
    <>
      <FlatList
        data={hubs}
        keyExtractor={(item) => item.serialNumber}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          if (!item || !item.serialNumber) return null;

          return (
            <TouchableOpacity
              onPress={() => setSelectedTab(item)}
              style={styles.hubItem}
            >
              <Text
                style={[
                  styles.hubText,
                  selectedTab?.serialNumber === item.serialNumber && {
                    color,
                    fontWeight: "bold",
                  },
                ]}
              >
                {item.name}
              </Text>

              {selectedTab?.serialNumber === item.serialNumber && (
                <View style={[styles.underline, { backgroundColor: color }]} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  hubItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  hubText: {
    fontSize: 25,
    color: "black",
  },
  underline: {
    height: 2,
    width: "100%",
    marginTop: 5,
  },
});
