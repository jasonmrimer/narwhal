class Airman < ActiveRecord::Base
    self.table_name = 'airman'
    has_and_belongs_to_many :certification, class_name: 'Certification', join_table: 'join_airman_certification'
end