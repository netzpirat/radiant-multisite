require 'digest/sha1'

class User < ActiveRecord::Base
  
  # Default Order
  order_by 'name'
  
  # Associations
  belongs_to :created_by, :class_name => 'User'
  belongs_to :updated_by, :class_name => 'User'
  
  # Validations
  validates_uniqueness_of :login, :message => 'login already in use'
  
  validates_confirmation_of :password, :message => 'must match confirmation', :if => :confirm_password?
  
  validates_presence_of :name, :login, :message => 'required'
  validates_presence_of :password, :password_confirmation, :message => 'required', :if => :new_record?
  
  validates_format_of :email, :message => 'invalid e-mail address', :allow_nil => true, :with => /^$|^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
  
  validates_length_of :name, :maximum => 100, :allow_nil => true, :message => '%d-character limit'
  validates_length_of :login, :within => 3..40, :allow_nil => true, :too_long => '%d-character limit', :too_short => '%d-character minimum'
  validates_length_of :password, :within => 5..40, :allow_nil => true, :too_long => '%d-character limit', :too_short => '%d-character minimum', :if => :validate_length_of_password?
  validates_length_of :email, :maximum => 255, :allow_nil => true, :message => '%d-character limit'
  
  validates_numericality_of :id, :only_integer => true, :allow_nil => true, :message => 'must be a number'
    
  attr_writer :confirm_password
  
  def sha1(phrase)
    Digest::SHA1.hexdigest("--#{salt}--#{phrase}--")
  end
  
  def self.authenticate(login, password)
    user = find_by_login(login)
    user if user && user.authenticated?(password)
  end
  
  def authenticated?(password)
    self.password == sha1(password)
  end
  
  def after_initialize
    @confirm_password = true
  end
  
  def confirm_password?
    @confirm_password
  end

  def remember_me
    update_attribute(:session_token, sha1(Time.now + Radiant::Config['session_timeout'].to_i)) unless self.session_token?
  end

  def forget_me
    update_attribute(:session_token, nil)
  end

  private
  
    def validate_length_of_password?
      new_record? or not password.to_s.empty?
    end
  
    before_create :encrypt_password
    def encrypt_password
      self.salt = Digest::SHA1.hexdigest("--#{Time.now}--#{login}--sweet harmonious biscuits--")
      self.password = sha1(password)
    end
  
    before_update :encrypt_password_unless_empty_or_unchanged
    def encrypt_password_unless_empty_or_unchanged
      user = self.class.find(self.id)
      case password
      when ''
        self.password = user.password
      when user.password  
      else
        encrypt_password
      end
    end

end
