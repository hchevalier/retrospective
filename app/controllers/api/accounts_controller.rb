# frozen_string_literal: true

class Api::AccountsController < ApplicationController
  def show
    render json: current_account.as_json and return if current_account

    render json: { status: :unauthorized }, status: :unauthorized
  end

  def update
    current_account.update!(account_params)

    if params[:retrospective_id]
      retrospective = current_account.retrospectives.find(params[:retrospective_id])
      participant = retrospective.participants.find_by(account: current_account)

      retrospective.broadcast_order('changeAvatar', { participant: participant.profile })
    end

    render json: :ok
  end

  private

  PARAMS_MAPPING = {
    'topType' => :avatar_top,
    'accessoriesType' => :avatar_accessories,
    'hairColor' => :avatar_hair_color,
    'facialHairType' => :avatar_facial_hair,
    'facialHairColor' => :avatar_facial_hair_color,
    'clotheType' => :avatar_clothe,
    'clotheColor' => :avatar_clothe_color,
    'graphicType' => :avatar_graphics,
    'eyeType' => :avatar_eyes,
    'eyebrowType' => :avatar_eyebrows,
    'mouthType' => :avatar_mouth,
    'skinColor' => :avatar_skin
  }.freeze

  def account_params
    params.permit(*PARAMS_MAPPING.keys).transform_keys { |key| PARAMS_MAPPING[key] }
  end
end
