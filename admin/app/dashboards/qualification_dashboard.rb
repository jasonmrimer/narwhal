require "administrate/base_dashboard"

class QualificationDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    airman: Field::HasMany,
    id: Field::Number,
    acronym: Field::String,
    title: Field::String,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :airman,
    :id,
    :acronym,
    :title,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :airman,
    :id,
    :acronym,
    :title,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :airman,
    :acronym,
    :title,
  ].freeze

  # Overwrite this method to customize how qualifications are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(qualification)
  #   "Qualification ##{qualification.id}"
  # end
end
