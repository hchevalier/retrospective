class ReactionsController < ApplicationController
  before_action :ensure_logged_in

  def create
    retrospective = current_user.retrospective
    reflection = retrospective.reflections.find(params[:id])
    reaction = current_user.reactions.create!(reactions_params.merge(target: reflection))
    if retrospective.step != 'voting' || reaction.kind == 'emoji'
      OrchestratorChannel.broadcast_to(retrospective, action: 'newReaction', parameters: { reaction: reaction.readable })
    end

    render json: reaction.readable
  end

  def destroy
    current_user.reactions.find(params[:id]).destroy!
    OrchestratorChannel.broadcast_to(current_user.retrospective, action: 'dropReaction', parameters: { reactionId: params[:id] })

    render json: :ok
  end

  private

  def reactions_params
    params.permit(:kind, :content)
  end
end
