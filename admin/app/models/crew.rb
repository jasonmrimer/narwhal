class Crew < ActiveRecord::Base
  self.table_name = 'crew'
  has_and_belongs_to_many :airman, class_name: 'Airman', join_table: 'join_airman_crew'
end