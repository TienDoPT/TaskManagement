import firebase from '../../firebase/config';
// import 'firebase/firestore';

export const AddGroup = async (groupName, host, members) => {
    try {
        return await firebase
            .firestore()
            .collection('groups')
            .add({
                groupName: groupName,
                host: host,
                members: members,
            }).then((docRef) => {
                firebase
                    .firestore()
                    .collection("groups")
                    .doc(`${docRef.id}`).update({ groupId: docRef.id })
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    } catch (error) {
        console.log(error)
        return error;
    }
};

export const GroupMemberMod = async (groupId, members) => {
    try {
        return await firebase
            .firestore()
            .collection('groups')
            .doc(groupId)
            .update({
                members: members,
            });
    } catch (error) {
        console.log(error)
        return error;
    }
};

export const DelGroup = async (groupId) => {
    try {
        return await firebase
            .firestore()
            .collection("groups")
            .doc(`${groupId}`)
            .delete()
    } catch (error) {
        console.log(error)
        return error;
    }
};