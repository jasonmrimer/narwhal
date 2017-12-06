class RosterPage
    include Capybara::DSL

    def initialize
        visit '/'
    end

    def has_a_roster?
        within_table('Roster') do
            page.has_text?('NAME')
        end
    end

    def has_airmen_in_roster?
        within_table('Roster') do
            page.has_selector?('td', count: 3)
        end
    end
end