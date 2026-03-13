import client from "./redisClient.js";

function createUserPair(socket, strangerData) {

  const user1 = {
    socketId: socket.id,
    username: socket.username,
    pairedUserId: strangerData.socketId,
    strangerUsername: strangerData.username
  }

  const user2 = {
    socketId: strangerData.socketId,
    username: strangerData.username,
    pairedUserId: socket.id,
    strangerUsername: socket.username
  }

  return [user1, user2]
}

export default async function makePair(socket) {

  try {

    const stranger = await client.lPop("users")

    if (!stranger) {
      return null
    }

    const strangerData = JSON.parse(stranger)

    const users = createUserPair(socket, strangerData)

    console.log("Paired", users[0].username, "with", users[1].username)

    return users

  } catch (err) {

    console.error("Pair error", err)
    return null

  }
}