# frozen_string_literal: true

class StaticController < ApplicationController
  skip_before_action :ensure_logged_in, only: :single_page_app

  def single_page_app; end
end
