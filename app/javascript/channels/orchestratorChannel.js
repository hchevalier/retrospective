import consumer from './consumer'

export const join = ({ retrospectiveId, onReceivedAction }) => {
  const orchestratorChannel = consumer.subscriptions.create({ channel: 'OrchestratorChannel', retrospective_id: retrospectiveId }, {
    connected() {
      console.log('You are connected to the orchestrator channel!')
    },
    disconnected() {
      console.log('You were disconnected from the orchestrator channel!')
    },
    changeStep() {
      this.perform('change_step')
    },
    startTimer(duration) {
      this.perform('start_timer', { duration: duration })
    },
    setRevealer(uuid) {
      this.perform('elect_revealer', { uuid: uuid })
    },
    reveal(reflectionUuid) {
      this.perform('reveal_reflection', { uuid: reflectionUuid })
    },
    dropRevealerToken() {
      this.perform('drop_revealer_token')
    },
    changeDiscussedReflection(reflectionUuid) {
      this.perform('change_discussed_reflection', { uuid: reflectionUuid })
    },
    received(data) {
      if (data.action) {
        onReceivedAction(data.action, data.parameters)
      }
    },
    ready() {
      return !consumer.connection.disconnected
    }
  })

  return orchestratorChannel
}
