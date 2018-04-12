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

  def assert_filters_by_site
    assert_shows_site('All Sites')
    filter_by_site(site: 'DGS-1')
    assert_shows_site('DGS-1')
  end

  def assert_filters_by_platform
    assert_shows_platform('Filter Platform')
    filter_by_platform('Filter Platform', 'U-2')
    assert_shows_platform('U-2')
  end

  def assert_shows_site(site)
    case site
    when 'All Sites'
      assert_shows_missions
    when site
      expect(page).to have_css('.mission-card', maximum: @@number_of_missions - 1)
    end
  end

  def assert_shows_platform(platform)
    case platform
    when 'Filter Platform'
      assert_shows_missions
    when platform
      expect(page).to have_css('.mission-card', maximum: @@number_of_missions - 1)
    end
  end

  def filter_by_site(site: 'All Sites')
    page.find(:select).find(:option, text: site).select_option
  end

  def filter_by_platform(item, value)
    page.within('.filters') do
      fill_in(item, with: value)
      click_link(value)
    end
  end
end