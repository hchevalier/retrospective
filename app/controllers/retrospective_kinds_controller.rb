class RetrospectiveKindsController < ApplicationController
  before_action :ensure_logged_in

  def index
    render json: Retrospective.available_kinds
  end
end
