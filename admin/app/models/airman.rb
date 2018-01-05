class Airman < ActiveRecord::Base
    self.table_name = 'airman'
    has_and_belongs_to_many :certification, class_name: 'Certification', join_table: 'join_airman_certification'
    has_and_belongs_to_many :qualification, class_name: 'Qualification', join_table: 'join_airman_qualification'
    has_and_belongs_to_many :crew, class_name: 'Crew', join_table: 'join_airman_crew'
    belongs_to :unit
end