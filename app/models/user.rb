class User < ActiveRecord::Base
  has_secure_password
  has_attached_file :avatar
  has_many :notes
  email_regex = /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]+)\z/i
  validates_attachment_content_type :avatar, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: email_regex }
  validates :username, uniqueness: {case_sensitive: false}
  validates :first_name, :last_name, :username, presence: true
end
