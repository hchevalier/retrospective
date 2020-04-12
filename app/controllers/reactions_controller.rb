class ReactionsController < ApplicationController
  before_action :ensure_logged_in

  def create
    reflection = current_user.retrospective.reflections.find(params[:id])
    reaction = current_user.reactions.create!(reactions_params.merge(target: reflection))
    # TODO: broadcast readable reaction

    render json: reaction.readable
  end

  def destroy
    current_user.reactions.find(params[:id]).destroy!

    render json: :ok
  end

  private

  def reactions_params
    params.permit(:kind, :content)
  end
end
