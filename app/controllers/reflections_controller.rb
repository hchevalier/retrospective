class ReflectionsController < ApplicationController
  before_action :ensure_logged_in

  def create
    zone = Zone.find_by(id: params[:zone_id], retrospective: current_user.retrospective)
    return render(json: { status: :not_found}) unless zone

    reflection = current_user.reflections.create(reflections_params)
    #TODO: broadcase anonymous reflection

    render json: reflection.readable
  end

  def update
    reflection = Reflection.find(params[:id])
    case current_user
    when reflection.owner
      reflection.update!(reflections_params)
    when reflection.retrospective.organizer
      reflection.update!(reflections_organizer_params)
    else
      return render(json: { status: :forbidden})
    end

    render json: reflection.readable
  end

  def destroy
    current_user.reflections.find(params[:id]).destroy!

    render json: :ok
  end

  private

  def reflections_params
    params.permit(:content, :zone_id)
  end

  def reflections_organizer_params
    params.permit(:topic_id, :position_in_zone, :position_in_topic)
  end
end
