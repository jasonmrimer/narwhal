class Skill
  include Capybara::DSL
  include RSpec::Matchers
  attr_accessor :earn, :expiration, :qual_title, :cert_title

  def initialize
    set_attrs
  end

  def create_invalid
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      click_link_or_button '+ Add Skill'
      find('input[type="submit"]').click
    end
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
      scroll_to(page.find('.currency-title', text: @qual_title))
      page.find('.currency-title', text: @qual_title).click
      fill_in 'expirationDate', with: @expiration.strftime('%m/%d/%Y')
      find('input[type="submit"]').click
    end
  end

  def delete_qualification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @qual_title))
      page.find('.currency-title', text: @qual_title).click
      click_link_or_button 'DELETE'
      expect(page.has_content? '+ Add Skill').to be true
    end
  end

  def qualification_exists?
    page.within('.side-panel') do
      return page.has_content?('CURRENCY') && page.has_content?(@qual_title)
    end
  end

  def qualification_correct_date?
    page.within('.side-panel') do
      return page.has_content?('CURRENCY') &&
          page.has_content?(@expiration.strftime('%d %^b %y')) &&
          page.has_content?(@qual_title)
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
      scroll_to(page.find('.currency-title', text: @cert_title))
      page.find('.currency-title', text: @cert_title).click
      fill_in 'expirationDate', with: @expiration.strftime('%m/%d/%Y')
      find('input[type="submit"]').click
    end
  end

  def delete_certification
    page.within('.side-panel') do
      find('a', text: 'CURRENCY').click
      scroll_to(page.find('.currency-title', text: @cert_title))
      page.find('.currency-title', text: @cert_title).click
      click_link_or_button 'DELETE'
      expect(page.has_content? '+ Add Skill').to be true
    end
  end

  def certification_exists?
    page.within('.side-panel') do
      return page.has_content?('CURRENCY') && page.has_content?(@cert_title)
    end
  end

  def certification_correct_date?
    page.within('.side-panel') do
      return page.has_content?('CURRENCY') &&
          page.has_content?(@expiration.strftime('%d %^b %y')) &&
          page.has_content?(@cert_title)
    end
  end

  private

  def set_attrs
    @earn = Time.now
    @expiration = @earn + (60 * 60 * 24 * 365)
    @qual_title = 'HT - Instructor'
    @cert_title = 'X-Ray Vision'
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
