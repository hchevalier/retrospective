# frozen_string_literal: true

class Api::RetrospectiveKindsController < ApplicationController
  def index
    render json: Retrospective.available_kinds
  end
end
