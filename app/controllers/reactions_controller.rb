class ReactionsController < ApplicationController
  before_action :ensure_participant

  def create
    retrospective = current_user.retrospective
    reflection = retrospective.reflections.find(params[:reflection_id])
    reaction = current_user.reactions.create!(reactions_params.merge(target: reflection))
    if retrospective.step != 'voting' || reaction.emoji?
      OrchestratorChannel.broadcast_to(retrospective, action: 'newReaction', parameters: { reaction: reaction.readable })
    elsif retrospective.step == 'voting' && reaction.vote?
      OrchestratorChannel.broadcast_to(retrospective, action: 'updateOrganizerInfo', parameters: { organizerInfo: retrospective.organizer_info })
    end

    render json: reaction.readable
  end

  def destroy
    retrospective = current_user.retrospective
    reaction = current_user.reactions.find(params[:id])
    return render(json: :forbidden) if reaction.vote? && retrospective.step != 'voting'

    reaction.destroy!
    OrchestratorChannel.broadcast_to(retrospective, action: 'dropReaction', parameters: { reactionId: params[:id] })
    if retrospective.step == 'voting' && reaction.vote?
      OrchestratorChannel.broadcast_to(retrospective, action: 'updateOrganizerInfo', parameters: { organizerInfo: retrospective.organizer_info })
    end

    render json: :ok
  end

  private

  def reactions_params
    params.permit(:kind, :content)
  end
end
