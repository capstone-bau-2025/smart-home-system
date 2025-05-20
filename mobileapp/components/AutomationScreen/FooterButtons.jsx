import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

// footer buttons for the automation info modal
export default function ({
  handleCloseModal,
  handleEdit,
  handleSave,
  create,
  hideClose,
  showDelete,
  handleDelete,
}) {
  return (
    <View style={create ? styles.centeredButton : styles.buttonContainer}>
      {create ? (
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Create</Text>
        </TouchableOpacity>
      ) : (
        <>
          {!hideClose && (
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          )}
          {showDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.deleteButton}
            >
              <Text style={styles.closeText}>Delete</Text>
            </TouchableOpacity>
          )}
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
  centeredButton: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: "#f3aa3c",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  deleteButton: {
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
  saveButton: {
    backgroundColor: "#fcae11",
    paddingVertical: 20,
    paddingHorizontal: 40, 
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
});
