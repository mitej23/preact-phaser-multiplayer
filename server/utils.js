const {connectDB} = require('./connectDB');

const supabase = connectDB();


const createRoom = async (roomId) => {
    
    const { data, error } = await supabase
        .from('rooms')
        .insert([
            { room_id: roomId, started_by},
        ]) 

    return [data, error]
}

const createPlayer = async (roomId, name, walkingAnimationMapping, email, socketId) => {
    const { data, error } = await supabase
        .from('players')
        .insert([
          { room_id: roomId, name: name, x: 3, y: 4, sprite: walkingAnimationMapping, facing_direction: "down" ,email_id: email, socket_id: socketId},
        ])
    
    return [data, error]
}    

const getRoom = async (roomId) => {
    const { data, error } = await supabase
        .from('rooms')
        .select("*")
        .eq('room_id', roomId)

    return [data, error]
}

const getRoomByEmail = async (email) => {
    const { data, error } = await supabase
        .from('rooms')
        .select("*")
        .eq('started_by', email)
    
    return [data, error]
}

const getPlayerByEmail = async (email) => {
    const { data, error } = await supabase
        .from('players')
        .select("*")
        .eq('email_id', email)
    
    return [data, error]
}
        
const updatePlayer = async (playerId, socketId, roomId) => {

    // update name, sprite

    const { data, error } = await supabase
        .from('players')
        .update({
            socket_id: socketId,
            room_id: roomId
        })
        .eq('id', playerId)

    return [data, error]
}

const getPlayersFromRoom = async (roomId) => {
    const { data, error } = await supabase
        .from('players')
        .select("*")
        .eq('room_id', roomId)
    
    return [data, error]
}

const getPlayerBySocketId = async (socketId) => {
    const { data, error } = await supabase
        .from('players')
        .select("*")
        .eq('socket_id', socketId)

    return [data, error]
}

const removePlayerBySocketId = async (socketId) => {
    const { data, error } = await supabase
        .from('players')
        .delete()
        .eq('socket_id', socketId)
    
    return [data, error]
}

const removePlayerByPlayerId = async (playerId) => {
    const { data, error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId)

    return [data, error]
}

const removeRoom = async (roomId) => {
    const { data, error } = await supabase
        .from('rooms')
        .delete()
        .eq('room_id', roomId)

    return [data, error]
}

const updateNameAndSocketId = async (id, name, socketId) => {
    const {data, error} = await supabase
        .from('players')
        .update({
            socket_id: socketId,
            name: name,
            connected: true
        })
        .eq('id', id)

    return [data, error]
}

const disconnectPlayer = async (id) => {
    const {data, error} = await supabase
        .from('players')
        .update({
            connected: false
        })
        .eq('socket_id', id)
    
    return [data, error]
}

const getPlayerByPlayerId = async (playerId) => {
    const { data, error } = await supabase
        .from('players')
        .select("*")
        .eq('id', playerId)

    return [data, error]
}

const updatePlayerPosition = async (playerId, x, y,facingDirection) => {
    const { data, error } = await supabase
        .from("players")
        .update({
            x: x,
            y: y,
            facing_direction: facingDirection
        })
        .eq('id',playerId);

    return [data, error]
}    
        



module.exports = {
    createRoom,
    createPlayer,
    getRoom,
    getRoomByEmail,
    getPlayerByEmail,
    updatePlayer,
    updatePlayerPosition,
    getPlayersFromRoom,
    getPlayerBySocketId,
    removePlayerBySocketId,
    removeRoom,
    removePlayerByPlayerId,
    updateNameAndSocketId,
    disconnectPlayer,
    getPlayerByPlayerId
}
