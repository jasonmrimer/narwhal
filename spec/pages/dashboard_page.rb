class DashboardPage
    include Capybara::DSL
    include RSpec::Matchers

    def initialize 
        visit '/dashboard'
        expect(page).to have_css('.mission-card')
        @@number_of_missions = page.find_all('.mission-card').count
    end

    def assert_shows_missions
        expect(page).to have_css('.mission-card', count: @@number_of_missions)
    end

    def assert_shows_site(site)
        case site
        when 'All Sites'
            assert_shows_missions
        when site
            expect(page).to have_css('.mission-card', maximum: @@number_of_missions - 1)
        end
    end
    
    def filter_by(site: 'All Sites')
        page.find(:select).find(:option, text: site).select_option
    end
end