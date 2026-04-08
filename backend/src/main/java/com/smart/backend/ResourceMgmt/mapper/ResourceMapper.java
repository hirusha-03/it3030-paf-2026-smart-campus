package com.smart.backend.ResourceMgmt.mapper;

import com.smart.backend.ResourceMgmt.dto.ResourceRequestDTO;
import com.smart.backend.ResourceMgmt.dto.ResourceResponseDTO;
import com.smart.backend.ResourceMgmt.model.Resource;
import com.smart.backend.TicketMgmt.model.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ResourceMapper {
    
    Resource toEntity(ResourceRequestDTO dto);
    
    @Mapping(target = "createdBy", source = "createdBy", qualifiedByName = "userToString")
    @Mapping(target = "typeDisplayName", ignore = true)
    ResourceResponseDTO toDto(Resource entity);
    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget Resource entity, ResourceRequestDTO dto);
    
    @AfterMapping
    default void setTypeDisplayName(@MappingTarget ResourceResponseDTO dto, Resource entity) {
        if (entity.getType() != null) {
            dto.setTypeDisplayName(entity.getType().getDisplayName());
        }
    }
    
    @Named("userToString")
    default String userToString(User user) {
        return user != null ? user.getName() : null;
    }
}