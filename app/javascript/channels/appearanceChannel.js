import consumer from "./consumer"

export const join = (retrospectiveId) => {
  const appearanceChannel = consumer.subscriptions.create({ channel: 'AppearanceChannel', retrospective_id: retrospectiveId }, {
    connected() {
      console.log('You are connected to the appearance channel!')
      appearanceChannel.send({ body: 'Hello' })
    },
    disconnected() {
      console.log('You were disconnected from the appearance channel!')
    },
    received(data) {
      if (data.new_participant) {
        console.log('New participant', data.new_participant)
      } else if (data.body) {
        console.log(data.body)
      }
    },
  })

  return appearanceChannel
}
