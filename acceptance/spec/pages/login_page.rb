require_relative './tracker_page'

class LoginPage
  include Capybara::DSL

  def initialize
    visit '/login'
  end

  def login
    fill_in 'username', with: 'tytus'
    fill_in 'password', with: 'password'
    click_on 'Login'
    return TrackerPage.new
  end
end