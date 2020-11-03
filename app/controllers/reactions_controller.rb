# frozen_string_literal: true

class ReactionsController < ApplicationController
  before_action :ensure_participant

  def create
    retrospective = current_participant.retrospective
    target =
      if params[:topic_id]
        retrospective.topics.find(params[:topic_id])
      elsif params[:reflection_id]
        retrospective.reflections.find(params[:reflection_id])
      end

    reaction = current_participant.reactions.create!(reactions_params.merge(target: target, retrospective: current_participant.retrospective))
    if retrospective.step != 'voting' || reaction.emoji?
      OrchestratorChannel.broadcast_to(retrospective, action: 'newReaction', parameters: { reaction: reaction.readable })
    elsif retrospective.step == 'voting' && reaction.vote?
      OrchestratorChannel.broadcast_to(retrospective, action: 'updateFacilitatorInfo', parameters: { facilitatorInfo: retrospective.facilitator_info })
    end

    render json: reaction.readable
  end

  def destroy
    retrospective = current_participant.retrospective
    reaction = current_participant.reactions.find(params[:id])
    return render(json: :forbidden) if reaction.vote? && retrospective.step != 'voting'

    reaction.destroy!
    OrchestratorChannel.broadcast_to(retrospective, action: 'dropReaction', parameters: { reactionId: params[:id] })
    if retrospective.step == 'voting' && reaction.vote?
      OrchestratorChannel.broadcast_to(retrospective, action: 'updateFacilitatorInfo', parameters: { facilitatorInfo: retrospective.facilitator_info })
    end

    render json: :ok
  end

  private

  def reactions_params
    params.permit(:kind, :content)
  end
end
