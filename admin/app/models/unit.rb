class Unit < ActiveRecord::Base
    self.table_name = 'unit'
    has_many :airmen
end