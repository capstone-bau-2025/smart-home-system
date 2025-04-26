import { StyleSheet, Text, View, TouchableOpacity } from "react-native";


//footer buttons for the automation info modal
export default function ({ handleCloseModal, handleEdit, handleSave, edit }) {
  return (
    <View style={styles.buttonContainer}>
      {edit ? (

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ) : (

        <>
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#2D9CDB",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  editText: {
    color: "white",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#2793ae", 
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});
