class DashboardPage
    include Capybara::DSL
    def initialize 
        visit '/dashboard'
    end

    def has_missions?
        page.has_content?('Rimer')
        page.has_content?('HGZ3W09')
        page.has_content?('HGZ3W08')
    end
end