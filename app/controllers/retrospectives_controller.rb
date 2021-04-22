# frozen_string_literal: true

class RetrospectivesController < ApplicationController
  def create
    retrospective = Retrospective.create(retrospective_params.merge(facilitator_attributes: facilitator_attributes))

    if retrospective.persisted?
      cookies.signed[:participant_id] = retrospective.facilitator_id
      render json: { id: retrospective.id }
    else
      render json: { status: :unprocessable_entity, errors: retrospective.errors }
    end
  end

  private

  def retrospective_params
    params.permit(:group_id, :kind, options: [:weeks_displayed])
  end

  def facilitator_attributes
    { surname: current_account.username, account_id: current_account.id }
  end
end
