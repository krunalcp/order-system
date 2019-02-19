class AccountSerializer < ActiveModel::Serializer
  attributes :id, :name, :contact_name, :email, :phone
end
