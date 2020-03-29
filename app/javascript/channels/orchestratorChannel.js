import consumer from "./consumer"

export const join = (retrospectiveId) => {
   const orchestratorChannel = consumer.subscriptions.create({ channel: 'OrchestratorChannel', retrospective_id: retrospectiveId }, {
    connected() {
      console.log('You are connected to the orchestrator channel!')
    },
    disconnected() {
      console.log('You were disconnected from the orchestrator channel!')
    },
    received(data) {
      if (data.action === 'next') {
        console.log('Received order to go to next step')
      }
    },
  })

  return orchestratorChannel
}
