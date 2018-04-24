class FlightsPage
  include Capybara::DSL
  include RSpec::Matchers

  def initialize
    visit '/flights'
    expect(page).to have_css('.airman-name')
  end

  def assert_shows_airmen
    expect(page).to have_css('.airman-name', minimum: 1)
  end

  def assert_shows_airman_profile
    click_on_airman('Angie, Patton')
    expect(page).to have_content('94 IS')
    expect(page).to have_content('DMS Maryland')
  end

private

def click_on_airman(name)
  page.find('span', text: name).click
  expect(page).to have_content('Personal Information')
end

end