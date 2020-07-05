class RetrospectiveKindsController < ApplicationController
  def index
    render json: Retrospective.available_kinds
  end
end
