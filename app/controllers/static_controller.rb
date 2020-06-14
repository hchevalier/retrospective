class StaticController < ApplicationController
  def dashboard
   @retrospectives = current_account.retrospectives.distinct.map(&:as_short_json)
   @tasks = current_account.participants.flat_map(&:assigned_tasks).map(&:as_json).sort_by { |task| task[:created_at] }
  end
end
