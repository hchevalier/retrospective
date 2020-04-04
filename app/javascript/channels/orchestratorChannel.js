import consumer from "./consumer"

export const join = ({ retrospectiveId, onReceivedAction }) => {
   const orchestratorChannel = consumer.subscriptions.create({ channel: 'OrchestratorChannel', retrospective_id: retrospectiveId }, {
    connected() {
      console.log('You are connected to the orchestrator channel!')
    },
    disconnected() {
      console.log('You were disconnected from the orchestrator channel!')
    },
    startTimer(duration) {
      // this.timerDuration
      this.perform('start_timer', { duration: duration })
    },
    received(data) {
      if (data.action === 'next') {
        console.log('Received order to go to next step')
        onReceivedAction(data.action, data.parameters)
      } else if (data.action === 'setTimer') {
        onReceivedAction(data.action, data.parameters)
      }
    },
  })

  return orchestratorChannel
}
