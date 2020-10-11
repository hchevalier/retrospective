class ReflectionsController < ApplicationController
  before_action :ensure_participant

  def create
    retrospective = current_participant.retrospective
    zone = Zone.find_by(id: params[:zone_id], retrospective: retrospective)
    return render(json: { status: :not_found }) unless zone

    return render(json: { status: :forbidden }) if current_participant.reflections.where(zone: zone).any? && retrospective.zones_typology == :limited

    reflection = Reflection.transaction do
      current_participant.reflections.where(zone: zone).delete_all if retrospective.zones_typology == :single_choice
      current_participant.reflections.create(reflections_params)
    end

    render json: reflection.readable
  end

  def update
    reflection = Reflection.find(params[:id])
    case current_participant
    when reflection.owner
      reflection.update!(reflections_params)
    when reflection.retrospective.facilitator
      reflection.update!(reflections_facilitator_params)
    else
      return render(json: { status: :forbidden })
    end

    render json: reflection.readable
  end

  def destroy
    current_participant.reflections.find(params[:id]).destroy!

    render json: :ok
  end

  private

  def reflections_params
    params.permit(:content, :zone_id)
  end

  def reflections_facilitator_params
    params.permit(:topic_id, :position_in_zone, :position_in_topic)
  end
end
