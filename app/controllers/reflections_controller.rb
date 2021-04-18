# frozen_string_literal: true

class ReflectionsController < ApplicationController
  include TopicsHelper
  before_action :ensure_participant

  def create
    retrospective = current_participant.retrospective
    zone = Zone.find_by(id: params[:zone_id], retrospective: retrospective)
    return render(json: { status: :not_found }) unless zone

    if current_participant.reflections.where(zone: zone).any? && retrospective.zones_typology == :limited
      return render(json: { status: :forbidden })
    end

    reflection = Reflection.transaction do
      current_participant.reflections.where(zone: zone).delete_all if retrospective.zones_typology == :single_choice
      current_participant.reflections.create(reflections_params)
    end

    render json: reflection.readable
  end

  def update
    retrospective = current_participant.retrospective
    reflection = retrospective.reflections.find(params[:id])
    check_authorizations!(retrospective)

    previous = { zone_id: reflection.zone_id, topic: reflection.topic }
    reflection.update!(current_participant == reflection.owner ? reflections_params : reflections_limited_params)
    resolve_zone_changed(previous)
    broadcast_change_topic(retrospective, { reflection: reflection.readable }) if retrospective.reached_step?(:grouping)

    render json: reflection.readable
  end

  def destroy
    current_participant.reflections.find(params[:id]).destroy!

    render json: :ok
  end

  private

  def check_authorizations!(retrospective)
    retrospective.zones.find(params[:zone_id]) if params[:zone_id]
    retrospective.topics.find(params[:topic_id]) if params[:topic_id]
  end

  def resolve_zone_changed(previous)
    return if reflection.zone_id == previous[:zone_id]

    reflection.update!(topic_id: nil)
    clean_orphans(previous[:topic]) if previous[:topic]
  end

  def reflections_params
    params.permit(:content, :topic_id, :position_in_zone, :position_in_topic, :zone_id)
  end

  def reflections_limited_params
    params.permit(:topic_id, :position_in_zone, :position_in_topic, :zone_id)
  end
end
