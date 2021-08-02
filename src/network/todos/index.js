import firebase from '../../firebase/config';
// import 'firebase/firestore';

export const AddTodo = async (groupId, userId, todo, deadline, status) => {
    let seen = false;
    let time = new Date()
    try {
        return await firebase
            .firestore()
            .collection('todos')
            .add({
                groupId, userId, todo, deadline, status, seen, time
            }).then(() => { })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    } catch (error) {
        console.log(error)
        return error;
    }
};

export const DelTodo = async (todoId) => {
    try {
        return await firebase
            .firestore()
            .collection("todos")
            .doc(`${todoId}`)
            .delete()
    } catch (error) {
        console.log(error)
        return error;
    }
};

export const UpdateTodo = async (todoId, currentStatus) => {
    const newStatus = () => currentStatus ? false : true;
    try {
        return await firebase
            .firestore()
            .collection("todos")
            .doc(`${todoId}`)
            .update({
                status: newStatus()
            })
    } catch (error) {
        console.log(error)
        return error;
    }
};