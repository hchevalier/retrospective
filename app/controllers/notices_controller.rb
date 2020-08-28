class NoticesController < ApplicationController
  before_action :ensure_participant

  def create
    current_user.update(step_done: !current_user.step_done) if params[:message] == 'toggle_step_done'

    OrchestratorChannel.broadcast_to(
      current_user.retrospective,
      action: 'updateFacilitatorInfo',
      parameters: { facilitatorInfo: current_user.retrospective.facilitator_info }
    )
    render json: :ok
  end
end
