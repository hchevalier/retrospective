class ReactionsController < ApplicationController
  before_action :ensure_logged_in

  def create
    reflection = current_user.reflections.find(params[:id])
    # TODO: handle content for reactions that aren't votes
    content =
      case reactions_params[:kind]
      when 'vote'
        '🥇'
      else
        '👏'
      end
    reaction = current_user.reactions.create!(kind: reactions_params[:kind], target: reflection, content: content)
    # TODO: broadcast readable reaction

    render json: reaction.readable
  end

  def destroy
    current_user.reactions.find(params[:id]).destroy!

    render json: :ok
  end

  private

  def reactions_params
    params.permit(:kind)
  end
end
