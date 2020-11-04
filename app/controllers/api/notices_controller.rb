# frozen_string_literal: true

class Api::NoticesController < ApplicationController
  before_action :ensure_participant

  def create
    current_participant.update(step_done: !current_participant.step_done) if params[:message] == 'toggle_step_done'

    current_participant.retrospective.broadcast_order(
      'updateFacilitatorInfo',
      { facilitatorInfo: current_participant.retrospective.facilitator_info }
    )
    render json: :ok
  end
end
