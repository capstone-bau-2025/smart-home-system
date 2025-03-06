import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function HubsTabs({ hubs, setSelectedTab, selectedTab }) {
  return (
    <FlatList
      data={hubs}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => setSelectedTab(item)} style={styles.hubItem}>
          <Text style={[styles.hubText, selectedTab.id === item.id && styles.selectedTab]}>
            {item.name}
          </Text>
          {selectedTab.id === item.id && <View style={styles.underline} />}
        </TouchableOpacity>
      )}
    />
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
  selectedTab: {
    color: "orange",
    fontWeight: "bold",
  },
  underline: {
    height: 2,
    width: "100%",
    backgroundColor: "orange",
    marginTop: 5,
  },
});
