class Skill
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :earn, :expiration

  def initialize
    set_attrs
  end

  def create_qualification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      click_link_or_button '+ Add Skill'
      select 'Qualification', from: 'Type:'
      select 'HT - Instructor', from: 'Name:'
      continue_submission
    end
  end

  def update_qualification
    @expiration += 3600000
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @qualTitle))
      page.find('.currency-title', text: @qualTitle).click
      fill_in 'expirationDate', with: @expiration.strftime('%m/%d/%Y')
      find('input[type="submit"]').click
    end
  end

  def create_certification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      click_link_or_button '+ Add Skill'
      select 'Certification', from: 'Type:'
      select 'X-Ray Vision', from: 'Name:'
      continue_submission
    end
  end

  def update_certification
    @expiration += 3600000
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @certTitle))
      page.find('.currency-title', text: @certTitle).click
      fill_in 'expirationDate', with: @expiration.strftime('%m/%d/%Y')
      find('input[type="submit"]').click
    end
  end

  def qualification_exists?
    page.within('.side-panel') do
      page.has_content?('CURRENCY') &&
      page.has_content?(@qualTitle)
    end
  end

  def qualification_correct_date?
    page.within('.side-panel') do
      page.has_content?('CURRENCY') &&
      page.has_content?(@expiration.strftime('%d %b %y')) &&
      page.has_content?(@qualTitle)
    end
  end

  def certification_correct_date?
    page.within('.side-panel') do
      page.has_content?('CURRENCY') &&
      page.has_content?(@expiration.strftime('%d %b %y')) &&
      page.has_content?(@certTitle)
    end
  end

  def certification_exists?
    page.within('.side-panel') do
      page.has_content?('CURRENCY') &&
      page.has_content?('X-Ray Vision')
    end
  end

  private

  def set_attrs
    @earn = Time.now.utc
    @expiration = @earn + 36000000
    @qualTitle = 'HT - Instructor'
    @certTitle = 'X-Ray Vision'
  end

  def continue_submission
    fill_in 'earnDate', with: @earn.strftime('%m/%d/%Y')
    fill_in 'expirationDate', with: @expiration.strftime('%m/%d/%Y')
    find('input[type="submit"]').click
  end

  def scroll_to(element)
    script = <<-JS
      arguments[0].scrollIntoView(true);
    JS

    Capybara.current_session.driver.browser.execute_script(script, element.native)
  end
end
