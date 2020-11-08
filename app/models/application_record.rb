# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def requires_anonymization?
    return @requires_anonymization if defined?(@requires_anonymization)

    @requires_anonymization = Rails.const_defined?('Console') && Rails.env.production?
  end

  def anonymize(attribute)
    return attribute unless requires_anonymization?

    attribute.gsub(/[a-z0-9\-_ ]+/mi, '*' * attribute.size)
  end
end
