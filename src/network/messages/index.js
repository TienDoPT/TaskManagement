import firebase from '../../firebase/config';



export const senderMsg = async (msgValue, currentUserId, guestUserId, img) => {
  let time = new Date();
  try {
    return await firebase
      .database()
      .ref('messages/' + currentUserId)
      .child(guestUserId)
      .push({
        message: {
          sender: currentUserId,
          receiver: guestUserId,
          msg: msgValue,
          img: img,
          time: time
        },
      }).then(()=>{console.log(time)});

  } catch (error) {
    return error;
  }
};

export const receiverMsg = async (msgValue, currentUserId, guestUserId, img) => {
  let time = new Date();
  try {
    return await firebase
      .database()
      .ref('messages/' + guestUserId)
      .child(currentUserId)
      .push({
        message: {
          sender: currentUserId,
          receiver: guestUserId,
          msg: msgValue,
          img: img,
          time: time
        },
      });
  } catch (error) {
    return error;
  }
};

//group chat

export const groupMessages = async (msgValue, currentUserId, groupId, img) => {
  let time = new Date();
  try {
    return await firebase
      .database()
      .ref('groupMessages/' + groupId)
      .push({
        message: {
          sender: currentUserId,
          receiver: groupId,
          msg: msgValue,
          img: img,
          time: time
        },
      });
  } catch (error) {
    return error;
  }
};