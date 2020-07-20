class RetrospectivesController < ApplicationController
  before_action :http_authenticate
  before_action :preload_current_user_and_relationships, only: :show
  skip_before_action :ensure_logged_in, only: :show

  def index
    group_ids = current_account.accessible_groups.ids
    retrospectives = current_account.retrospectives.where(group_id: group_ids)
    render json: retrospectives.map(&:as_short_json).sort_by { | retrospective | retrospective[:createdAt] }.reverse
  end

  def create
    retrospective = Retrospective.create(retrospective_params.merge(facilitator_attributes: facilitator_attributes))

    if retrospective.persisted?
      cookies.signed[:user_id] = retrospective.facilitator_id
      render json: { id: retrospective.id }
    else
      render json: { status: :unprocessable_entity, errors: retrospective.errors }
    end
  end

  def show
    @retrospective =
      current_user&.retrospective_id == params[:id] ?
      current_user.retrospective :
      Retrospective.includes(:participants, :zones).find(params[:id])

    @invitation = PendingInvitation.find(params[:invitation_id]) if params[:invitation_id]

    if current_account
      participant = @retrospective.participants.find { |participant| participant.account == current_account }

      if participant && current_user&.id != participant.id
        cookies.signed[:user_id] = participant.id
      elsif !participant
        participant = Participant.create!(
          surname: current_account.username,
          account_id: current_account.id,
          retrospective: @retrospective
        )
        cookies.signed[:user_id] = participant.id
        @retrospective.group.add_member(current_account)
      end
      reload_current_user
    end

    @initial_state = @retrospective.initial_state(current_user)

    if current_user && current_user.account == current_account
      @participant = current_user
      @participant.join

      @initial_state.merge!(profile: current_user.full_profile)
    end
  end

  private

  def retrospective_params
    params.permit(:group_id, :kind)
  end

  def facilitator_attributes
    { surname: current_account.username, account_id: current_account.id }
  end

  def preload_current_user_and_relationships
    current_user_with_relationships_included
  end

  def http_authenticate
    return true unless Rails.env.production?

    authenticate_or_request_with_http_basic do |username, password|
      username == ENV.fetch('BASIC_AUTH_USERNAME') && password == ENV.fetch('BASIC_AUTH_PASSWORD')
    end
  end
end
