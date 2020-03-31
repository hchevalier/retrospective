class ReflectionsController < ApplicationController
  before_action :ensure_logged_in

  def create
    zone = Zone.find_by(id: params[:zone_id], retrospective: current_user.retrospective)
    return render(json: { status: 404}) unless zone

    reflection = current_user.reflections.create(reflections_params.merge(zone: zone))
    #TODO: broadcase anonymous reflection

    render json: reflection.readable
  end

  private

  def reflections_params
    params.permit(:content)
  end
end
